import { Model, Types } from "mongoose";
import QueryBuilder from "../app/builder/QueryBuilder";
import AppError from "../app/error/AppError";
import httpStatus from "http-status";

const findResources = async <T>(Model: Model<T>, QueryId: Types.ObjectId) => {
  if (!QueryId) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Id required to find ${Model.modelName} related data`
    );
  }
  const resource = await Model.findById(QueryId);
  if (!resource) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${QueryId.toString()} in ${Model.modelName} not found`
    );
  }
  return { [Model.modelName.toLowerCase()]: resource };
};

const findAllResources = async <T>(
  Model: Model<T>,
  Query: Record<string, unknown>,
  searchField: string[]
) => {
  console.log("Query:", Query);

  const baseQuery = Model.find();
  const queryBuilder = new QueryBuilder(baseQuery, Query)
    .search(searchField)
    .filter()
    .sort()
    .pagination()
    .fields();
  const resources = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  return { meta, [Model.modelName.toLowerCase()]: resources };
};

const deleteResources = async <T, K extends keyof T | undefined = undefined>(
  Model: Model<T>,
  deleteId: Types.ObjectId,
  ownerId?: Types.ObjectId,
  owner?: K
) => {
  const resource = await Model.findById(deleteId);
  if (!resource) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Id:${deleteId} of ${Model.modelName} not found`
    );
  }

  if (owner && ownerId) {
    if (owner in resource && resource[owner] instanceof Types.ObjectId) {
      if (ownerId.toString() !== resource[owner].toString()) {
        throw new AppError(
          httpStatus.NOT_ACCEPTABLE,
          "Owner does not own this resource"
        );
      }
    } else {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `${String(owner)} field not found in ${Model.modelName}`
      );
    }
  }

  const result = await Model.deleteOne({ _id: deleteId });
  if (!result.deletedCount) {
    throw new AppError(
      httpStatus.NOT_IMPLEMENTED,
      `Id:${deleteId} of ${Model.modelName} deletion failed`
    );
  }
  return {
    message: `Id:${deleteId} of ${Model.modelName} has been deleted successfully`,
  };
};

const GenericService = {
  findResources,
  findAllResources,
  deleteResources,
};

export default GenericService;
