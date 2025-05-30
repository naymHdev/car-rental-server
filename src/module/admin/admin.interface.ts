import { Document } from 'mongoose';
import { IUser } from '../user/user.interface';

export interface IAdmin extends IUser {
  contactNumber: string;
}

export interface IRecentActivity extends Document {
  title: string;
}

export interface IReport extends Document {
  title: string;
}
