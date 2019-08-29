const maxDigits = 21;

const checkValLimit = value => {
  return maxDigits > value.length ? true : false;
};


const isOperator = (clicked) => {
  const re = /[*\-+/]/;
  return re.test(clicked) ? true : false;
}

// helper function to remove class from drum-pads
const removeClass = (elementListened, propertyName, classToRemoveName) => {

  elementListened.forEach(pad => pad.addEventListener('transitionend', function(e) {

      if (e.propertyName !== propertyName) return; // skip if it is not transform
      this.classList.remove(classToRemoveName)
  }))
}


export { checkValLimit, isOperator, removeClass };



