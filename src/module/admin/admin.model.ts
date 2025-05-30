import { model, Model, Schema } from 'mongoose';
import MongooseHelper from '../../utility/mongoose.helpers';
import { IAdmin } from './admin.interface';
import { UserSchema } from '../user/user.model';

const AdminSchema = new Schema(
  {
    ...UserSchema,
    contactNumber: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

MongooseHelper.applyToJSONTransform(AdminSchema);

const Admin: Model<IAdmin> = model<IAdmin>('Admin', AdminSchema);
export default Admin;