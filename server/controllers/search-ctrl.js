'use strict';

module.exports.getFilterType = (req, res, next) => {
  if(req.query.name){
    console.log("NAME!", req.query.name);
  }
  else if(req.query.type) {
    console.log("TYPE!", req.query.type);
  }
  else if(req.query.region) {
    console.log("REGION!", req.query.region);
  }
  else if(req.query.motion){
    console.log("MOTION!", req.query.motion);
  }
  console.log(req.query, "ZZZ");
}
