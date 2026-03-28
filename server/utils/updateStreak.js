const updateStreak = (user) => {
    const today = new Date();
    const lastLogged = user.lastLoggedDate;

    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const lastDate = lastLogged
        ? new Date(lastLogged.getFullYear(), lastLogged.getMonth(), lastLogged.getDate())
        : null;
    const timeDifference = lastDate ? todayDate - lastDate : null;
    const dayDifference = timeDifference ? timeDifference / (1000 * 60 * 60 * 24) : null;

    if (dayDifference === 0){
        return;
    }

    if (!lastDate) {
        user.currentStreak = 1;
    } else if (dayDifference === 1) {
        user.currentStreak += 1;
    } else if (dayDifference > 1) {
        user.currentStreak = 1;
    }

    if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
    }
    user.lastLoggedDate = todayDate;
};

module.exports = updateStreak;