const moment = require("moment");

module.exports = {
    formatDate: function(date, format) {
        return moment(date).format(format);
    },
    truncate: function(text, size) {
        if (text.length > size && text.length > 0) {
            let newText = text + " ";
            newText = text.substr(0, size);
            newText = text.substr(0, newText.lastIndexOf(" "));
            newText = newText.length > 0 ? newText : text.substr(0, size);
            return newText + "...";
        }
        return text;
    },
    scriptTags: function(text) {
        return text.replace(/<(?:.|\n)*?>/gm, "");
    },
    editIcon: function(storyUser, loggedUser, storyId, floating=true) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
            if (floating) {
                return `<a href="/stories/edit/${ storyId }" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
            } else {
                return `<a href="/stories/edit/${ storyId }"><i class="fas fa-edit"></i></a>`;
            }
        } else {
            return "";
        }
    },
    select: function(selected, options) {
        return options
            .fn(this)
            .replace(
                new RegExp(' value="' + selected + '"'),
                '$& selected="selected"'
            )
            .replace(
                new RegExp('>' + selected + '</option>'),
                ' selected="selected"$&'
            );
    }
};