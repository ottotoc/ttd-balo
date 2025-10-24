// Standard response helpers
const success = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

const paginated = (res, items, total, page, limit) => {
  res.json({
    success: true,
    data: {
      items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    },
  });
};

module.exports = { success, paginated };

