class dstInput extends HTMLElement {
	constructor() {
		super();

		//shadow to encapsulate and isolate component from DOM
		var shadow = this.attachShadow({mode: 'open'});

		//group inline elements into table like structure
		var wrapper = document.createElement('span');
		wrapper.setAttribute('class', 'wrapper');
		var counting = false;

		//input box
		var box = document.createElement('input');

		// to limit the number of chars you can type
		if (this.hasAttribute('max')){
			var maxlimit = this.getAttribute('max');
			// if we need to create a counter
			if (this.hasAttribute('counter')){
				counting = (this.getAttribute('counter') == 'true');
				if (counting){
					// extra span to put the counter in
					// counter ONLY if we have a max limit
					var counter = document.createElement('span');
					// set it to a certain class to style it
					counter.setAttribute('class', 'counter label');
					// put the string 'Max characters' in front
					counter.innerHTML = 'Max characters: ' + maxlimit;
				}
			}
		}
		// maxlimit is how much we can have maximally
		else
			var maxlimit = 0;


		// to some input boxes only nums, to some only letters
		// like a RegEx formula
		if (this.hasAttribute('valid_input'))
			var valid_input = this.getAttribute('valid_input');
		else
			var valid_input = '';


		box.addEventListener('keyup', _ => {
			if (maxlimit > 0){
				//doesn't allow you to write if you've typed more than max limit
				if (box.value.length > maxlimit){
					box.value = box.value.substring( 0, maxlimit );
  					return false;
  				}
  				// initially say max characters
  				// could only happen if keyup is backspace
  				else if (box.value.length == 0){
  					if (counting)
  						counter.innerHTML = 'Max characters: ' + maxlimit;
					}
				// replace max characters with characters left
  				else{
  					if (counting)
  						counter.innerHTML = 'Characters left: ' + (maxlimit - box.value.length);
					}
			}
		});

		// valid_input is variable where you've read this attribute to
		if (valid_input != '' || maxlimit > 0){
			// if we have regex
			if (valid_input != ''){
				// convert it from a string to a regex object
				var re = new RegExp(valid_input);
				box.addEventListener('keydown', function(e) {
					// 46, 8 are delete and backspace
					if (!re.test(String.fromCharCode(e.keyCode)) && e.keyCode !== 46 && e.keyCode !== 8)
						e.preventDefault();
				});
			}

			// handles copy/paste
			box.addEventListener('paste', function(e) {
				//take data from clipboard
				var clipboarddata = e.clipboardData.getData('text');
				if (valid_input != ''){
					//same thing as above, but can't copy delete/backspace
					if (!re.test(clipboarddata))
						e.preventDefault();
				}
				// so you can't paste a long thing in
				if (maxlimit > 0){
					if (clipboarddata.length > maxlimit)
						e.preventDefault();
					else if (clipboarddata.length == 0){
						if (counting)
							counter.innerHTML = 'Max characters: ' + maxlimit;
					}
					else{
						if (counting)
							counter.innerHTML = 'Characters left: ' + (maxlimit - clipboarddata.length);
					}
				}
			});

			//same thing, but with drag and drop
			box.addEventListener('drop', function(e) {
				var data = e.dataTransfer.getData("text");
				if (valid_input != ''){
					//if (!data.match(re))
					if (!re.test(data))
						e.preventDefault();
				}
				if (maxlimit > 0){
					if (data.length > maxlimit)
						e.preventDefault();
					else if (data.length == 0){
						if (counting)
							counter.innerHTML = 'Max characters: ' + maxlimit;
					}
					else{
						if (counting)
							counter.innerHTML = 'Characters left: ' + (maxlimit - data.length);
					}
				}
			});
		}

		// what size should font be... md/lg/sm
		if(this.hasAttribute('size'))
			var size = this.getAttribute('size');
		// default is medium
		else
            var size = 'md';

        // can just set an attribute because we have a stylesheet
        box.setAttribute('class', 'dst-input ' + size);

        //put something in box i.e. 'password' to tell user what input box takes
        if(this.hasAttribute('placeholder'))
        	box.placeholder = this.getAttribute('placeholder');

        //create another spam to put a label to left or on top
		var label = document.createElement('span');
		//new element, we check if it has an attribute of label-left
		if(this.hasAttribute('label-left')){
			label.setAttribute('class', 'label left ' + size);
			label.innerHTML = this.getAttribute('label-left');
			wrapper.appendChild(label);
			wrapper.appendChild(box);
		}
		else if(this.hasAttribute('label-top')){
			label.setAttribute('class', 'label top ' + size);
			label.innerHTML = this.getAttribute('label-top');
			wrapper.appendChild(label);
			var br = document.createElement('br');
			wrapper.appendChild(br);
			wrapper.appendChild(box);
		}
		else
			wrapper.appendChild(box);

		if (counting)
			wrapper.appendChild(counter);

		// disable box if necessary
        if (this.hasAttribute('disabled'))
        	box.setAttribute('disabled', '');

	    const style = document.createElement('style');
	    style.textContent = `

			.dst-input{
				background-color: #EEEEEE;
				border: 1px solid;
				border-color: #909090;
				font-family: Arial, sans-serif;
				padding-left: 10px;
			}

			.lg{
				height: 40px;
				font-size: 18px;
			}

			.md{
				height: 35px;
				font-size: 16px;
			}

			.sm{
				height: 30px;
				font-size: 14px;
			}


			.dst-input:focus{
				border-color: #2F60AD;
				outline: none !important;
			}

			.dst-input:disabled{
				background-color: #EEEEEE;
				border-color: #DADADA;
				outline: none !important;
			}

			.dst-input::placeholder{
				font-style: italic;
			}

			.label{
			   font-family: Arial, sans-serif;
			   color: #909090;
			}

			.counter{
				padding-left: 10px;
			}

			.left{
				padding-right: 10px;
			}

			.top{
			   text-align: bottom;
			   margin-bottom: 6px;
			}
	`;

	    // Attach the created elements to the shadow dom
	    // shadow root
	    shadow.appendChild(style);
	    shadow.appendChild(wrapper);

	  }


	  // disabled element is treated very specially, needs to be outside

	  set disabled(isDisabled) {
			if(isDisabled) {
			  this.setAttribute('disabled', '');
			}
			else {
			  this.removeAttribute('disabled');
			}
	   }

	   get disabled() {
			return this.hasAttribute('disabled');
	   }

	}

// Define the new element
customElements.define('dst-input', dstInput);






