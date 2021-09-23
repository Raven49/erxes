import * as sinon from 'sinon';
import Automations, { ITrigger } from "../models/Automations";
import { Executions } from "../models/Executions";
import { automationFactory } from "../models/factories";
import { calculateExecution, receiveTrigger, reset, tags } from "../utils";
import * as utils from "../utils";
import "./setup";
import { ACTIONS } from '../constants';

describe('getOrCreateExecution', () => {
  beforeEach(async () => {
    await Automations.remove({});
    await Executions.remove({});
    reset();
  })

  test("consecutive", async (done) => {
    const automationId = '_id';
    const fakeTrigger: ITrigger = {
      id: '_id',
      type: 'deal',
      config: {
        contentId: '_id',
        reEnrollment: true,
        reEnrollmentRules: ['amount', 'title'],
      }
    }

    const target = { _id: 'dealId', amount: 100, title: 'title', description: 'description' };

    const mock = sinon.stub(utils, 'isInSegment').callsFake(() => {
      return Promise.resolve(true);
    });

    await calculateExecution({ automationId, trigger: fakeTrigger, target });

    // new entry must be inserted
    const execution = await Executions.findOne();

    expect(execution.automationId).toBe(automationId);
    expect(execution.triggerId).toBe(fakeTrigger.id);
    expect(execution.targetId).toBe(target._id);
    expect(execution.target).toEqual(target);

    // since data is same no entry must be inserted
    await calculateExecution({ automationId, trigger: fakeTrigger, target });

    expect(await Executions.find().count()).toBe(1);


    // amount is changed therefore new entry must be inserted
    target.amount = 200;
    await calculateExecution({ automationId, trigger: fakeTrigger, target });

    expect(await Executions.find().count()).toBe(2);

    const secondExecution = await Executions.findOne({ _id: { $ne: execution._id } });

    expect(secondExecution.target.amount).toBe(200);

    // changing title field
    target.title = 'changed title';
    await calculateExecution({ automationId, trigger: fakeTrigger, target });

    expect(await Executions.find().count()).toBe(3);

    const third = await Executions.findOne({ _id: { $nin: [execution._id, secondExecution._id] } });
    expect(third.target.title).toBe('changed title');

    // changing non important field
    target.description = 'changed decription';
    await calculateExecution({ automationId, trigger: fakeTrigger, target });

    expect(await Executions.find().count()).toBe(3);

    mock.restore();

    done();
  });
});

const triggers = [
  {
    id: "1",
    type: "deal",
    config: {
      contentId: "segmentId",
      reEnrollment: true,
      reEnrollmentRules: ["amount", "Amount"],
    },
    actionId: "1",
  },
];

describe('executeActions (if)', () => {
  beforeEach(async () => {
    /*
          deal created (trigger)
              |
            Add tag
              |
        IF (customer has name)
              |
              / \
            yes  no
            |
        Remove tag
    */

    await automationFactory({
      name: "1",
      status: 'active',
      triggers,
      actions: [
        {
          id: "1",
          type: ACTIONS.ADD_TAGS,
          config: { names: ["t1", "t2"] },
          nextActionId: "2",
        },
        {
          id: "2",
          type: ACTIONS.IF,
          config: {
            segmentId: "segmentIdd",
            yes: "3",
          },
        },
        {
          id: "3",
          type: ACTIONS.REMOVE_TAGS,
          config: {
            names: ["t1"],
          },
        },
      ],
    });
  });

  afterEach(async () => {
    await Automations.remove({});
    await Executions.remove({});
    reset();
  })

  test("if yes", async (done) => {
    const mock = sinon.stub(utils, 'isInSegment').callsFake(() => {
      return Promise.resolve(true);
    });

    await receiveTrigger({ type: "deal", targets: [{ _id: 'dealId1', amount: 100 }] });

    expect(tags).toEqual(["t2"]);
    expect(await Automations.find().count()).toBe(1);
    expect(await Executions.find().count()).toBe(1);

    const execution = await Executions.findOne();

    expect(execution.triggerId).toBe('1');
    expect(execution.waitingActionId).toBe(null);
    expect(execution.startWaitingDate).toBe(null);

    mock.restore();

    done();
  });

  test("if no", async (done) => {
    const mock = sinon.stub(utils, 'isInSegment').callsFake((segmentId) => {
      if (segmentId === 'segmentId') {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    });

    await receiveTrigger({ type: "deal", targets: [{ _id: "dealId2" }] });

    expect(tags).toEqual(["t1", "t2"]);

    mock.restore();

    done();
  });
});

describe('executeActions (wait)', () => {
  beforeEach(async () => {
    /*
          deal updated (trigger)
              |
            Add tag
              |
            Wait (1 day)
              |
        IF (customer has name)
              |
              / \
            yes  no
    */
    await automationFactory({
      name: "1",
      status: 'active',
      triggers,
      actions: [
        {
          id: "1",
          type: ACTIONS.ADD_TAGS,
          config: { names: ["t1", "t2"] },
          nextActionId: "2",
        },
        {
          id: "2",
          type: ACTIONS.WAIT,
          config: {
            period: '1d',
          },
          nextActionId: "3",
        },
        {
          id: "3",
          type: ACTIONS.IF,
          config: {
            segmentId: "segmentId",
          },
        },
      ],
    });
  });

  afterEach(async () => {
    await Automations.remove({});
    await Executions.remove({});
    reset();
  })

  test("wait", async (done) => {
    const mock = sinon.stub(utils, 'isInSegment').callsFake(() => {
      return Promise.resolve(true);
    });

    await receiveTrigger({ type: "deal", targets: [{ _id: "dealId1" }] });

    expect(tags).toEqual(["t1", "t2"]);

    const execution = await Executions.findOne();

    expect(execution.waitingActionId).toBe('2');
    expect(execution.startWaitingDate).not.toBe(null);

    mock.restore();

    done();
  });
});

describe('executeActions (placeholder)', () => {
  beforeEach(async () => {
    await automationFactory({
      name: "1",
      status: 'active',
      triggers:
        [{
          id: '1',
          type: "customer",
          actionId: '1',
          config: {
            contentId: 'segmentId',
            reEnrollment: true,
            reEnrollmentRules: ['firstName']
          },
        }],

      actions: [
        {
          id: "1",
          type: "createDeal",
          config: { title: "title {{ firstName }}", description: 'Custom fields data: {{ customFieldsData.fieldId }}' },
        },
      ],
    });
  });

  afterEach(async () => {
    await Automations.remove({});
    await Executions.remove({});
    reset();
  })

  test("check deal", async (done) => {
    const customer = {
      _id: '_id',
      firstName: 'firstName',
      customFieldsData: [
        { field: 'fieldId', value: 'custom value' }
      ]
    }

    const mock = sinon.stub(utils, 'isInSegment').callsFake(() => {
      return Promise.resolve(true);
    });

    await receiveTrigger({ type: "customer", targets: [customer] });

    // const execution = await Executions.findOne({});

    // const deal = execution.actionsData[0].data;

    // expect(deal.title).toBe('title firstName');
    // expect(deal.description).toBe('Custom fields data: custom value');

    mock.restore();

    done();
  });
});
