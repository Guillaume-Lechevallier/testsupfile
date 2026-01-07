const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // trace dans la console

    const status = err.status || 500;
    const message = err.message || "Erreur interne du serveur";

    res.status(status).json({
        message: message
    });
};

module.exports = errorHandler;