const refreshStreak = (user) => {
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (!user.lastLoggedDate) {
        return false;
    }

    const lastLogged = new Date(user.lastLoggedDate);
    const lastDate = new Date(
        lastLogged.getFullYear(),
        lastLogged.getMonth(),
        lastLogged.getDate()
    );

    const timeDifference = todayDate - lastDate;
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

    if (dayDifference > 1 && user.currentStreak !== 0) {
        user.currentStreak = 0;
        return true;
    }

    return false;
};

module.exports = refreshStreak;