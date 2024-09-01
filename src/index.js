
const resources = {

};

const game = new ex.Engine({
    width: 800,
    height: 600
});

// Resource loader
const loader = new ex.Loader();
for (res in resources) {
    loader.addResource(resources[res]);
}

game.start(loader);