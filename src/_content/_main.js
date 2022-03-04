const _log = new Log('ContentScript');

InitializeServiceWaker();

InitializeInjector();

InitializeHttpRequestBridge();


const buit_in_functions_implementation = `
// Reference https://stackoverflow.com/questions/881515/how-do-i-declare-a-namespace-in-javascript

(function( PM, $, undefined ) {
    PM.ActionElements = async function (selector, proc)
	{
		const elements = Array.from(document.querySelectorAll(selector));
			
        await Promise.all(elements.map(async (element) => {
            proc(element);
        }));
	}
	
	PM.RemoveElementsBySelector = async function (selector)
	{
        await PM.ActionElements(selector, function(e) {
            e.remove();
        });
	}

    PM.RemoveElementsBySelectors = async function (selectors)
	{
        await Promise.all(selectors.map(async (selector) => {
            PM.RemoveElementsBySelector(selector);
        }));
	}
	
	PM.StyleElementsBySelector = async function (selector, styles)
	{
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
		
		if (isDOM(selector))
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

    function isDOM(selector)
	{
		return selector instanceof Element;
	}
}( window.PM = window.PM || {}, PM ));
`;