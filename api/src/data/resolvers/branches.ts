import { Branches, Users } from '../../db/models';
import { IBranchDocument } from '../../db/models/definitions/structures';

export default {
  users(branch: IBranchDocument) {
    return Users.find({ _id: { $in: branch.userIds || [] } });
  },

  parent(branch: IBranchDocument) {
    return Branches.findOne({ _id: branch.parentId });
  },

  children(branch: IBranchDocument) {
    return Branches.find({ parentId: branch._id });
  }
};
