const db = require('../../data/db-config');

const findAll = async () => {
  return await db('workOrders');
};

const findByUser = async (userId) => {
  return db('workOrders')
    .from('workOrders as wo')
    .where(function () {
      this.where('createdBy', userId).orWhere('assignedTo', userId);
    })
    .join('profiles as u', 'wo.createdBy', 'u.id')
    .join('profiles as a', 'wo.assignedTo', 'a.id')
    .join('companies as c', 'c.id', 'wo.company')
    .join('properties as p', 'p.id', 'wo.property')
    .join('priority as pr', 'pr.id', 'wo.priority')
    .join('status as s', 's.id', 'wo.status')
    .join('comments', 'wo.id', 'comments.workOrder')
    .join('images', 'wo.id', 'images.workOrder')
    .select(
      'wo.id',
      'wo.title',
      'wo.description',
      'wo.created_at',
      'wo.updated_at',
      db.raw('row_to_json(s) as status'),
      db.raw('row_to_json(pr) as priority'),
      db.raw('row_to_json(c) as company'),
      db.raw('row_to_json(p) as property'),
      db.raw(
        'ARRAY(SELECT row_to_json(images) FROM images WHERE images."workOrder" = wo.id) AS images'
      ),
      db.raw(
        'ARRAY(SELECT row_to_json(comments) FROM comments WHERE comments."workOrder" = wo.id) AS comments'
      ),
      db.raw('row_to_json(u) as createdBy'),
      db.raw('row_to_json(a) as assignedTo')
    )
    .distinctOn('wo.id');
};

const findBy = (filter) => {
  return db('workOrders')
    .from('workOrders as wo')
    .where(filter)
    .join('profiles as u', 'wo.createdBy', 'u.id')
    .join('profiles as a', 'wo.assignedTo', 'a.id')
    .join('companies as c', 'c.id', 'wo.company')
    .join('properties as p', 'p.id', 'wo.property')
    .join('priority as pr', 'pr.id', 'wo.priority')
    .join('status as s', 's.id', 'wo.status')
    .join('comments', 'wo.id', 'comments.workOrder')
    .join('images', 'wo.id', 'images.workOrder')
    .select(
      'wo.id',
      'wo.title',
      'wo.description',
      'wo.created_at',
      'wo.updated_at',
      db.raw('row_to_json(s) as status'),
      db.raw('row_to_json(pr) as priority'),
      db.raw('row_to_json(c) as company'),
      db.raw('row_to_json(p) as property'),
      db.raw(
        'ARRAY(SELECT row_to_json(images) FROM images WHERE images."workOrder" = wo.id) AS images'
      ),
      db.raw(
        'ARRAY(SELECT row_to_json(comments) FROM comments WHERE comments."workOrder" = wo.id) AS comments'
      ),
      db.raw('row_to_json(u) as createdBy'),
      db.raw('row_to_json(a) as assignedTo')
    )
    .distinctOn('wo.id');
};

const findById = async (workOrderId) => {
  return db('workOrders')
    .from('workOrders as wo')
    .where('wo.id', workOrderId)
    .join('profiles as u', 'wo.createdBy', 'u.id')
    .join('profiles as a', 'wo.assignedTo', 'a.id')
    .join('companies as c', 'c.id', 'wo.company')
    .join('properties as p', 'p.id', 'wo.property')
    .join('priority as pr', 'pr.id', 'wo.priority')
    .join('status as s', 's.id', 'wo.status')
    .join('comments', 'wo.id', 'comments.workOrder')
    .join('images', 'wo.id', 'images.workOrder')
    .select(
      'wo.id',
      'wo.title',
      'wo.description',
      'wo.created_at',
      'wo.updated_at',
      db.raw('row_to_json(s) as status'),
      db.raw('row_to_json(pr) as priority'),
      db.raw('row_to_json(c) as company'),
      db.raw('row_to_json(p) as property'),
      db.raw(
        'ARRAY(SELECT row_to_json(images) FROM images WHERE images."workOrder" = wo.id) AS images'
      ),
      db.raw(
        'ARRAY(SELECT row_to_json(comments) FROM comments WHERE comments."workOrder" = wo.id) AS comments'
      ),
      db.raw('row_to_json(u) as createdBy'),
      db.raw('row_to_json(a) as assignedTo')
    )
    .first();
};

const findAllRelated = (userId, companyIds, propertyIds) => {
  return db('workOrders')
    .from('workOrders as wo')
    .where(function () {
      this.where('createdBy', userId)
        .orWhere('assignedTo', userId)
        .orWhereIn('company', companyIds)
        .orWhereIn('property', propertyIds);
    })
    .join('profiles as u', 'wo.createdBy', 'u.id')
    .join('profiles as a', 'wo.assignedTo', 'a.id')
    .join('companies as c', 'c.id', 'wo.company')
    .join('properties as p', 'p.id', 'wo.property')
    .join('priority as pr', 'pr.id', 'wo.priority')
    .join('status as s', 's.id', 'wo.status')
    .join('comments', 'wo.id', 'comments.workOrder')
    .join('images', 'wo.id', 'images.workOrder')
    .select(
      'wo.id',
      'wo.title',
      'wo.description',
      'wo.created_at',
      'wo.updated_at',
      db.raw('row_to_json(s) as status'),
      db.raw('row_to_json(pr) as priority'),
      db.raw('row_to_json(c) as company'),
      db.raw('row_to_json(p) as property'),
      db.raw(
        'ARRAY(SELECT row_to_json(images) FROM images WHERE images."workOrder" = wo.id) AS images'
      ),
      db.raw(
        'ARRAY(SELECT row_to_json(comments) FROM comments WHERE comments."workOrder" = wo.id) AS comments'
      ),
      db.raw('row_to_json(u) as createdBy'),
      db.raw('row_to_json(a) as assignedTo')
    )
    .distinctOn('wo.id');
};

const create = async (workOrder) => {
  return db('workOrders').insert(workOrder).returning('*');
};

const update = (id, workOrder) => {
  return db('workOrders')
    .where({ id: id })
    .first()
    .update(workOrder)
    .returning('*');
};

const remove = async (id) => {
  return await db('workOrders').where({ id }).del();
};

const getComments = (workOrderId) => {
  return db('comments')
    .from('comments as c')
    .where({ workOrder: workOrderId })
    .join('profiles as u', 'c.author', 'u.id')
    .select('c.id', 'c.comment', 'c.workOrder', 'u.id', 'u.name')
    .distinctOn('c.id');
};

const addComment = (comment) => {
  return db('comments').insert(comment).returning('*');
};

const updateComment = (id, comment) => {
  return db('comments')
    .where({ id: id })
    .first()
    .update(comment)
    .returning('*');
};

const removeComment = async (id) => {
  return await db('comments').where({ id }).del();
};

const getImages = (workOrderId) => {
  return db('images')
    .from('images as i')
    .where({ workOrder: workOrderId })
    .join('profiles as u', 'i.user', 'u.id')
    .select('i.id', 'i.url', 'i.workOrder', 'u.id', 'u.name')
    .distinctOn('i.id');
};

const addImage = (image) => {
  return db('images').insert(image).returning('*');
};

const removeImage = async (id) => {
  return await db('images').where({ id }).del();
};

module.exports = {
  findAll,
  findByUser,
  findBy,
  findById,
  findAllRelated,
  create,
  update,
  remove,
  getComments,
  addComment,
  updateComment,
  removeComment,
  getImages,
  addImage,
  removeImage,
};
