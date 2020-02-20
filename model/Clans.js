/**
 * A class of clans that acts as a database table.
 */
class Clans {
  constructor() {
    this.clans = {
      "Mistborns": [
        {
          code: "gg8e6",
          tag: "<MST>",
          spreadSheetId: "10ba7ScChNuDVhXQbgUOnnEGrZ2y8ZPwWPV150tohDx4",
          name: "Mistborns"
        }
      ],
      "Wrath of Khans": [
        {
          code: "nmm94",
          tag: "WoK |",
          spreadSheetId: "1QucMi94udJ54t2ycUpHUzomhqNCTiypCp4i4trSuunA",
          name: "Wrath of Khans"
        }
      ]
    }
  }

  /**
   * Returns a single clan
   *
   * @param {String} name - clan name, this will be passed in from the discord member's role
   * @return {Clan} - a single clan object
   */
  getClanByName(name) {
    return this.clans[name]
  }
}

module.exports = Clans;
