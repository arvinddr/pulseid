module.exports = {
  async up(db) {
    await db.createCollection("rulesets")
  },

  async down(db) {
    await db.rulesets.drop()
  }
};
