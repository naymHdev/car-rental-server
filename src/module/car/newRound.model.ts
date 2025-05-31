import { model, Model, Schema, SchemaDefinition } from 'mongoose';
import { INewBattle, INewRound, IPlayer, IUser } from './car.interface';
import MongooseHelper from '../../utility/mongoose.helpers';
import { timeRegex } from '../../constants/regex.constants';

export const NewBattleSchema: SchemaDefinition = {
  creatorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  golfCourse: {
    type: String,
    required: true,
  },
  choosePlayer: {
    type: String,
    required: [true, 'Email is required'],
  },
  roundDate: {
    type: Date,
    required: [true, 'Round Date is required'],
  },
  roundTime: {
    type: String,
    required: [true, 'Round time is required'],
    validate: {
      validator: function (v: string) {
        return timeRegex.test(v);
      },
      message: (props: any) =>
        `${props.value} is not valid time formate (hh:mm AM/PM)`,
    },
  },
};

const BattleSchema = new Schema(
  {
    ...NewBattleSchema,
  },
  { timestamps: true },
);

const RoundSchema = new Schema(
  {
    ...NewBattleSchema,
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

MongooseHelper.findExistence<IPlayer>(BattleSchema);
MongooseHelper.applyToJSONTransform(BattleSchema);

MongooseHelper.findExistence<IPlayer>(RoundSchema);
MongooseHelper.applyToJSONTransform(RoundSchema);

export const Battle: Model<INewBattle> = model<INewBattle>(
  'Battle',
  BattleSchema,
);

export const Round: Model<INewRound> = model<INewRound>('Round', RoundSchema);
