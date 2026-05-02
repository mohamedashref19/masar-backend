class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // 1) FILTERING
  filter() {
    const { page, limit, sort, fields, ...queryObj } = this.queryString;

    // Advanced filtering: gte, gt, lte, lt → $gte, $gt, $lte, $lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte?|lte?)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // 2) SORTING
  sort() {
    if (this.queryString.sort) {
      // ?sort=bidAmount,-createdAt  →  .sort('bidAmount -createdAt')
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default: newest first (consistent with Masar feed ordering)
      this.query = this.query.sort('-createdAt _id');
    }
    return this;
  }

  // 3) FIELD LIMITING (Projecting)
  limitFields() {
    if (this.queryString.fields) {
      // ?fields=title,budget,status  →  .select('title budget status')
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Always exclude __v from responses
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // 4) PAGINATION
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20; // default 20 per page
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;

/*
 * ============================================================
 * HOW  IN CONTROLLERSTO USE
 * ============================================================
 *
 * Example — getAllProjects:
 *
 *   const features = new APIFeatures(
 *     Project.find({ status: { $in: ['open', 'beginner_window'] } }),
 *     req.query
 *   )
 *     .filter()
 *     .sort()
 *     .limitFields()
 *     .paginate();
 *
 *   const projects = await features.query;
 *
 * ============================================================
 * SUPPORTED QUERY PARAMS
 * ============================================================
 *
 * Filter:
 *   ?status=open
 *   ?budget[gte]=500&budget[lte]=5000
 *   ?requiredSkills=React
 *
 * Sort:
 *   ?sort=-budget          → highest budget first
 *   ?sort=bidAmount        → lowest bid first
 *   ?sort=-matchScore      → best match first (proposals)
 *
 * Field limiting:
 *   ?fields=title,budget,status,client
 *
 * Pagination:
 *   ?page=2&limit=10
 *
 * ============================================================
 */