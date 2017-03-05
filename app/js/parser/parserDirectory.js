function ParserDirectory(name, directories, files) {
	var self = this;
	self.name = name ? name : null;
	self.directories = directories ? directories : [];
	self.files = files ? files : [];
}