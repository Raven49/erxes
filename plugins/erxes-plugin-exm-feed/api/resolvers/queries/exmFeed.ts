import * as moment from 'moment';

const getDateRange = (filterType: string) => {
  return {
    $gte: new Date(
      moment()
        .add(filterType === 'today' ? 0 : 1, 'days')
        .format('YYYY-MM-DD')
    ),
    $lt: new Date(
      moment()
        .add(filterType === 'today' ? 1 : 8, 'days')
        .format('YYYY-MM-DD')
    )
  };
};

const exmFeedQueries = [
  {
    name: 'exmFeedDetail',
    handler: async (_root, params, { models, checkPermission, user }) => {
      await checkPermission('showExm', user);

      return models.ExmFeed.findOne({ _id: params._id });
    }
  },
  {
    name: 'exmFeedCeremonies',
    handler: async (
      _root,
      { contentType, filterType },
      { models, checkPermission, user }
    ) => {
      await checkPermission('showExm', user);

      const filter: {
        'ceremonyData.willDate': any;
        contentType?: string;
      } = {
        'ceremonyData.willDate': getDateRange(filterType)
      };

      if (contentType) {
        filter.contentType = contentType;
      }

      return {
        list: await models.ExmFeed.find(filter),
        totalCount: await models.ExmFeed.find(filter).countDocuments()
      };
    }
  },
  {
    name: 'exmFeed',
    handler: async (
      _root,
      { isPinned, title, contentTypes, limit, skip, recipientType, type },
      { models, checkPermission, user }
    ) => {
      await checkPermission('showExm', user);

      const doc: any = {};

      if (
        contentTypes &&
        contentTypes.includes('publicHoliday') &&
        type === 'recipient'
      ) {
        doc.createdAt = { $lt: new Date() };
      }

      if (title) {
        doc.title = new RegExp(`.*${title}.*`, 'i');
      }

      if (contentTypes && contentTypes.length > 0) {
        doc.contentType = { $in: contentTypes };
      }

      if (
        contentTypes &&
        contentTypes.includes('event') &&
        type === 'recipient'
      ) {
        doc.$or = [
          { 'eventData.visibility': 'public' },
          {
            'eventData.visibility': 'private',
            recipientIds: { $in: [user._id] }
          }
        ];
      }

      if (
        contentTypes &&
        contentTypes.includes('bravo') &&
        type === 'recipient'
      ) {
        if (recipientType === 'recieved') {
          doc.recipientIds = { $in: [user._id] };
        } else if (recipientType === 'sent') {
          doc.createdBy = user._id;
        } else {
          doc.$or = [
            { recipientIds: { $in: [user._id] } },
            { createdBy: user._id }
          ];
        }
      }

      if (type === 'createdByMe') {
        doc.createdBy = user._id;
      }

      if (isPinned !== undefined) {
        if (isPinned) {
          doc.isPinned = true;
        } else {
          doc.isPinned = { $ne: true };
        }
      }

      return {
        list: await models.ExmFeed.find(doc)
          .sort({ createdAt: -1 })
          .skip(skip || 0)
          .limit(limit || 20),
        totalCount: await models.ExmFeed.find(doc).countDocuments()
      };
    }
  }
];

export default exmFeedQueries;
