export const roleFilter = (user) => {
  // DEFAULT SAFE: only published courses
  let filter = { status: "Published" };

  if (user?.accountType === "Admin") {
    filter = {};
  }

  else if (user?.accountType === "Instructor") {
    filter = {
      $or: [
        { status: "Published" },
        { instructor: user.id }
      ]
    };
  }

  return filter;
};