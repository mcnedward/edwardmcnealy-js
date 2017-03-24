function Apod(data) {
  var self = this;

  self.date = data ? data.date : null;
  self.explanation = data ? data.explanation : null;
  self.title = data ? data.title : null;
  self.hdUrl = data && data.hdurl ? data.hdurl : 'null';
  self.url = data && data.url ? data.url : '';
  self.mediaType = data ? data.media_type : null;

  return {
    date: self.date,
    explanation: self.explanation,
    title: self.title,
    hdUrl: self.hdUrl,
    url: self.url,
    mediaType: self.mediaType,
    titleAndDate: self.title + ' (' + self.date + ')'
  };
}