import mongoose, { Schema } from 'mongoose';
import PasswordUtils from './password.utils';
import { idConverter } from './idConverter';
import AppError from '../app/error/AppError';
import httpStatus from 'http-status';

interface ISavePassword {
  password?: string;
  isModified(path: string): boolean;
}

const preSaveHashPassword = (schema: Schema) => {
  schema.pre<ISavePassword>('save', async function (next) {
    if (this.isModified('password') && this.password) {
      this.password = await PasswordUtils.hashPassword(
        this.password as string,
        10,
      );
    }
    next();
  });
};

const comparePasswordIntoDb = (schema: Schema) => {
  schema.methods.comparePassword = async function (
    plainPassword: string,
  ): Promise<boolean> {
    return await PasswordUtils.comparePassword(plainPassword, this.password);
  };
};

const findExistence = <T>(schema: Schema) => {
  schema.statics.isExist = async function (
    id: string | mongoose.Types.ObjectId,
  ): Promise<T> {
    const validId = await idConverter(id);
    const result = await this.findById<T>(validId);
    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, 'Existence not found', '');
    }
    return result;
  };
};

const applyToJSONTransform = (schema: Schema) => {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = doc._id.toString();
      delete ret._id;
      delete ret.password;
      return ret;
    },
  });
};

const MongooseHelper = {
  applyToJSONTransform,
  preSaveHashPassword,
  comparePasswordIntoDb,
  findExistence,
};
export default MongooseHelper;
