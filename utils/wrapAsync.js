// function wrapAsync(fn) {
//     return function (req,res,next) {
//         fn(req,res,next).catch(next);
//     }
// }

// above  code ko change kiys sidha we use a dirct exports
// yad kar lo sytnax 
module.exports = (fn) =>  {
    return (req,res,next) => {
        fn(req,res,next).catch(next);
    }
}
