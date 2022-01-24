const moment = require("moment");

module.exports = {
  formatDate: function (date: any, format: any) {
    return moment(date).utc().format(format);
  },
  truncate: function (str: string, len: number) {
    if (str.length > len && str.length > 0) {
      let new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  },
  stripTags: function (input: string) {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },
  editIcon: function (
    travelUser: any,
    loggedUser: any,
    travelId: any,
    floating = true
  ) {
    if (travelUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/travels/edit/${travelId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
      } else {
        return `<a href="/travels/edit/${travelId}"><i class="fas fa-edit"></i></a>`;
      }
    } else {
      return "";
    }
  },
  select: function (selected: string, options: { fn: (arg0: any) => string }) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      );
  },
};
