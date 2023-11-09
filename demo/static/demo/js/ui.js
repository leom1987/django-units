document.addEventListener('DOMContentLoaded', () => {
    const circles = document.querySelectorAll('.circle');
    const radius = 100;
    let currentlySelected = 0;
    let positions = [];
  
    circles.forEach((circle, index) => {
        const angle = ((index - currentlySelected) * (360 / circles.length)) - 90;
        const x = radius * Math.cos(angle * Math.PI / 180);
        const y = radius * Math.sin(angle * Math.PI / 180);
        positions[index] = { x, y };
        circle.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    });

    circles.forEach((circle, index) => {
        circle.addEventListener('click', () => {
            console.log(`Clicked ${circle}`);

            const stepsToMove = (circles.length + currentlySelected - index) % circles.length;
            console.log(`${stepsToMove} STEPS TO MOVE CLOCKWISE`);
            
            for (let i = 0; i < stepsToMove; i++) {
                positions = rotateArray(positions);
                currentlySelected = (currentlySelected + stepsToMove) % circles.length;
                
                circles.forEach((circle, j) => {
                    const {x, y} = positions[j];
                    circle.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
                });
            }
        });
    });
});


function rotateArray(arr) {
    if (arr.length < 2) {
        return [...arr];
    }
    const firstElement = arr[0];
    const rotatedArray = [...arr.slice(1), firstElement];
    return rotatedArray;
}