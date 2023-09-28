import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const viewerStyle = Styles.style({
    $nest: {
        '&>*': {
            boxShadow: 'rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px',
            marginTop: '0px !important'
        }
    }
})