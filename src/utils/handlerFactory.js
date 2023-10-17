import catchAsync from './catchAsync';
import { AppError } from './AppError';
import { httpStatus, resStatus } from './enums';

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that id', httpStatus.NOT_FOUND));
    }

    res.status(httpStatus.NO_CONTENT).json({ status: resStatus.success, data: null });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that id', httpStatus.NOT_FOUND));
    }

    res.status(httpStatus.OK).json({ status: resStatus.success, data: doc });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    if (!doc) {
      return next(new AppError('No document created', httpStatus.INTERNAL_SERVER_ERROR));
    }

    res.status(httpStatus.CREATED).json({ status: resStatus.success, data: doc });
  });

export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that id', httpStatus.NOT_FOUND));
    }

    res.status(httpStatus.OK).json({
      status: resStatus.success,
      data: doc,
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.find();

    res.status(httpStatus.OK).json({
      status: resStatus.success,
      results: doc.length,
      data: doc,
    });
  });
