export function photoMarker(req, _res, next) {
  if (req.file && !('photo' in req.body)) {
    req.body.photo = '__file__';
  }
  next();
}
