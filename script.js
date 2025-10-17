function setFuel(fuel) {
    elements.fuel.innerText = `${(fuel*100).toFixed(0)}%`;
    elements.fuel.classList.remove('fuel-high','fuel-medium','fuel-low');

    if (fuel > 0.7) elements.fuel.classList.add('fuel-high');
    else if (fuel > 0.3) elements.fuel.classList.add('fuel-medium');
    else elements.fuel.classList.add('fuel-low');
}

function setHealth(health) {
    elements.health.innerText = `${(health*100).toFixed(0)}%`;
    elements.health.classList.remove('health-high','health-medium','health-low');

    if (health > 0.7) elements.health.classList.add('health-high');
    else if (health > 0.3) elements.health.classList.add('health-medium');
    else elements.health.classList.add('health-low');
}
