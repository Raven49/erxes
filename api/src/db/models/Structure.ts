import { Model, model } from 'mongoose';
import {
  IDepartmentDocument,
  departmentSchema,
  unitSchema,
  IUnitDocument,
  IBranchDocument,
  branchSchema
} from './definitions/structures';
import { IUserDocument } from './definitions/users';

export interface IDepartmentModel extends Model<IDepartmentDocument> {
  getDepartment(doc: any): IDepartmentDocument;
  createDepartment(doc: any, user: IUserDocument): IDepartmentDocument;
  updateDepartment(
    _id: string,
    doc: any,
    user: IUserDocument
  ): IDepartmentDocument;
  removeDepartment(_id: string): IDepartmentDocument;
}

export const loadDepartmentClass = () => {
  class Department {
    /*
     * Get a department
     */
    public static async getDepartment(doc: any) {
      const department = await Departments.findOne(doc);

      if (!department) {
        throw new Error('Department not found');
      }

      return department;
    }

    /*
     * Create an department
     */
    public static async createDepartment(doc: any, user: IUserDocument) {
      const department = await Departments.create({
        ...doc,
        createdAt: new Date(),
        createdBy: user._id
      });

      return department;
    }

    /*
     * Update an department
     */
    public static async updateDepartment(
      _id: string,
      doc: any,
      user: IUserDocument
    ) {
      await Departments.update(
        { _id },
        {
          ...doc,
          updatedAt: new Date(),
          updatedBy: user._id
        }
      );

      return Departments.findOne({ _id });
    }

    /*
     * Remove an department
     */
    public static async removeDepartment(_id: string) {
      const department = await Departments.getDepartment({ _id });

      await Departments.deleteMany({ parentId: department._id });

      return department.remove();
    }
  }

  departmentSchema.loadClass(Department);
};

loadDepartmentClass();

// tslint:disable-next-line
const Departments = model<IDepartmentDocument, IDepartmentModel>(
  'departments',
  departmentSchema
);

export interface IUnitModel extends Model<IUnitDocument> {
  getUnit(doc: any): IUnitDocument;
  createUnit(doc: any, user: IUserDocument): IUnitDocument;
  updateUnit(_id: string, doc: any, user: IUserDocument): IUnitDocument;
  removeUnit(_id: string): IUnitDocument;
}

export const loadUnitClass = () => {
  class Unit {
    /*
     * Get a unit
     */
    public static async getUnit(doc: any) {
      const unit = await Units.findOne(doc);

      if (!unit) {
        throw new Error('Unit not found');
      }

      return unit;
    }

    /*
     * Create an unit
     */
    public static async createUnit(doc: any, user: IUserDocument) {
      const unit = await Units.create({
        ...doc,
        createdAt: new Date(),
        createdBy: user._id
      });

      return unit;
    }

    /*
     * Update an unit
     */
    public static async updateUnit(_id: string, doc: any, user: IUserDocument) {
      await Units.update(
        { _id },
        {
          ...doc,
          updatedAt: new Date(),
          updatedBy: user._id
        }
      );

      return Units.findOne({ _id });
    }

    /*
     * Remove an unit
     */
    public static async removeUnit(_id: string) {
      const unit = await Units.getUnit({ _id });

      return unit.remove();
    }
  }

  unitSchema.loadClass(Unit);
};

loadUnitClass();

// tslint:disable-next-line
const Units = model<IUnitDocument, IUnitModel>('units', unitSchema);

export interface IBranchModel extends Model<IBranchDocument> {
  getBranch(doc: any): IBranchDocument;
  createBranch(doc: any, user: IUserDocument): IBranchDocument;
  updateBranch(_id: string, doc: any, user: IUserDocument): IBranchDocument;
  removeBranch(_id: string): IBranchDocument;
}

export const loadBranchClass = () => {
  class Branch {
    /*
     * Get a branch
     */
    public static async getBranch(doc: any) {
      const branch = await Branches.findOne(doc);

      if (!branch) {
        throw new Error('Branch not found');
      }

      return branch;
    }

    /*
     * Create an branch
     */
    public static async createBranch(doc: any, user: IUserDocument) {
      const branch = await Branches.create({
        ...doc,
        createdAt: new Date(),
        createdBy: user._id
      });

      return branch;
    }

    /*
     * Update an branch
     */
    public static async updateBranch(
      _id: string,
      doc: any,
      user: IUserDocument
    ) {
      await Branches.update(
        { _id },
        {
          ...doc,
          updatedAt: new Date(),
          updatedBy: user._id
        }
      );

      return Branches.findOne({ _id });
    }

    /*
     * Remove an branch
     */
    public static async removeBranch(_id: string) {
      const branch = await Branches.getBranch({ _id });

      return branch.remove();
    }
  }

  branchSchema.loadClass(Branch);
};

loadBranchClass();

// tslint:disable-next-line
const Branches = model<IBranchDocument, IBranchModel>('branches', branchSchema);

export { Departments, Units, Branches };
