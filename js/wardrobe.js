// js/wardrobe.js

function getWardrobeForDancer(dancerId) {
    return D.wardrobe.filter(item => item.dancerId === dancerId);
}

function addWardrobeItem(dancerId, name, isGroupProperty) {
    if (!name.trim()) return;
    const newItem = {
        id: "w_" + Date.now() + "_" + Math.floor(Math.random()*1000),
        dancerId: dancerId,
        name: name.trim(),
        isGroupProperty: isGroupProperty
    };
    D.wardrobe.push(newItem);
    save();
}

function removeWardrobeItem(itemId) {
    D.wardrobe = D.wardrobe.filter(item => item.id !== itemId);
    save();
}
