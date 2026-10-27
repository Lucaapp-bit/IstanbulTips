// Returns the public Google Maps browser key (restrict it by HTTP referrer in Google Cloud).
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ googleMapsKey: process.env.GOOGLE_MAPS_API_KEY || '' });
};
