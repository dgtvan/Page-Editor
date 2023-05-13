PGE.Element = class {

    static Action = async function(selector, callback)
	{
		const elements = Array.from(document.querySelectorAll(selector));
			
        await Promise.all(elements.map(async (element) => {
            callback(element);
        }));
	}
	
	static Style = async function(selector, styles)
	{
        let self = PGE.Element;

		const styleApplier = async function(element) {
            await Promise.all(styles.map(async (style) => {
                if (style.modifier)
                {
                    element.style.setProperty(style.property, style.value, style.modifier);
                }
                else
                {
                    element.style.setProperty(style.property, style.value);
                }
            }));
		}
		
		if (self.#IsDom(selector))
		{
			await styleApplier(selector);
		}
		else
		{
			await PM.ActionElements(selector, function(element) {
			    styleApplier(element);
			});
		}
	}

    static #IsDom = function(selector)
	{
		return selector instanceof Element;
	}
}