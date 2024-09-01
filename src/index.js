
const resources = {

};

const game = new ex.Engine({
    canvasElementId: 'game',
    antialiasing: false,
    backgroundColor: ex.Color.White,
    displayMode: ex.DisplayMode.FillContainer,
    pointerScope: ex.Input.PointerScope.Document
});

// Resource loader
const loader = new ex.Loader();
for (res in resources) {
    loader.addResource(resources[res]);
}

game.start(loader);