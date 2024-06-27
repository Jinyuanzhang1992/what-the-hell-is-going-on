const bcrypt = require("bcrypt");

const processUsers = async (users) => {
  try {
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const dob = new Date(Date.parse(user.dob.split("T")[0]));

        return {
          ...user,
          password: hashedPassword,
          dob: dob,
        };
      })
    );

    return usersWithHashedPasswords;
  } catch (error) {
    throw new Error(`I can't process the users [${error.message}]`);
  }
};

module.exports = {
  processUsers,
};
