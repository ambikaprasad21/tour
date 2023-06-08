class APIfeatures {
  constructor(query, queryString) {
    //queryString contains the router string, and the query contains all the data from database.
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; // ... this is used for destructuring the query object and building a new object
    const excludeFields = ['page', 'sort', 'fields', 'limit'];
    //for deleting all the excludeFields we will tranvese the array
    excludeFields.forEach(el => delete queryObj[el]); //we are using forEach becuase we don't want to save a new array
    console.log(queryObj); //{ difficulty: 'easy', duration: { gte: '5' } } --> this is simlar to querying in mongodb shell except here $ sign is missing before operator, so we need to put that $ sign

    //ADVANCED FILTERING

    let queryString = JSON.stringify(queryObj); //converting object to string
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      match => `$${match}`
    ); //we used g to replace all the occurence of matched operator, and \b to select only the operator name not ltinit here we also have lt but we will not take it
    console.log(JSON.parse(queryString)); //output the javascript object converted from string

    this.query = this.query.find(JSON.parse(queryString));
    //let query = Tour.find(JSON.parse(queryString)); //find() method recievs a javascript object, mongoose method returns a query
    return this; //we are returning the this so that we can chain different methods
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(',').join(' ');
      //query = query.sort(req.query.sort); //this is how mongoose sort the documents, to write more than one sort query then use ',' to seperate. Like this ?sort=price,ratingsAvg
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      //if someone do not define the sort then bydefault items must be sorted as specified
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields); //this will select the required fields from the query and make a new query which contains only the required fields
    } else {
      this.query = this.query.select('-__v'); //the - sign is used to not select that field
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // if (this.queryString.page) {
    //   const countDoc = await Tour.countDocuments();
    //   if (skip >= countDoc) throw new Error('This page does not exist');
    // } // this error is not required when there are no page the user can know that there exist no page
    return this;
  }
}
module.exports = APIfeatures;
