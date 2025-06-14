import { Model, Types } from "mongoose";
import QueryBuilder from "../app/builder/QueryBuilder";
import AppError from "../app/error/AppError";
import httpStatus from 'http-status'

const findAllResources = async<T>(Model: Model<T>, Query: Record<string, unknown>) => {
    const baseQuery = Model.find()
    const queryBuilder = new QueryBuilder(baseQuery, Query)
    const resources = await queryBuilder.modelQuery
    const meta = await queryBuilder.countTotal()

    return { meta, [Model.modelName.toLowerCase()]: resources }
}

const deleteResources = async <T>(Model: Model<T>, deleteId: Types.ObjectId, ownerId: Types.ObjectId, owner: string) => {
    const resource = Model.findById(deleteId)
    if (!resource) {
        throw new AppError(httpStatus.NOT_FOUND, `Id:${deleteId} of ${Model.modelName} not found`)
    }

    if (owner in resource && resource[owner] instanceof Types.ObjectId) {
        if (ownerId.toString() !== resource[owner].toString()) {
            throw new AppError(httpStatus.NOT_ACCEPTABLE, "Owner does not own this resource");
        }
    } else {
        throw new AppError(httpStatus.NOT_FOUND, `${owner} field not found in ${Model.modelName}`);
    }

    const result = await Model.deleteOne({ _id: deleteId })
    if (!result.deletedCount) {
        throw new AppError(httpStatus.NOT_IMPLEMENTED, `Id:${deleteId} of ${Model.modelName} deletion failed`)
    }
    return { message: `Id:${deleteId} of ${Model.modelName} not found` }
}

const GenericService = {
    findAllResources,
    deleteResources,
}

export default GenericService