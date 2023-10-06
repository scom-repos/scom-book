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

export const pagingStyle = Styles.style({
    display: 'block',
    $nest: {
        '@media(max-width: 970px)': {
            $nest: {
                '.paging': {
                    flexWrap: 'wrap',
                    gridTemplateColumns: '1fr'
                }
            }
        },
        '.btnPaging': {
            boxShadow: '0px 1px 2px rgb(0 0 0 / 12%)',
            border: '1px solid #EEE',
            padding: '16px',
            cursor: 'pointer',
            minWidth: 0,
            $nest: {
                '&.hidden': {
                    display: 'none',
                },
                'i-label': {
                    display: 'block',
                    lineHeight: '25px',
                },
                '&.prev': {
                    $nest: {
                        'i-icon': {
                            float: 'left',
                        },
                        'i-panel.pager-content': {
                            float: 'right',
                            $nest: {
                                'i-label': {
                                    textAlign: 'right',
                                },
                            },
                        },
                        '@media (max-width: 700px)': {
                            width: '100%',
                        },
                    },
                },
                '&.next': {
                    $nest: {
                        'i-icon': {
                            float: 'right',
                        },
                        'i-panel.pager-content': {
                            float: 'left',
                            $nest: {
                                'i-label': {
                                    textAlign: 'left',
                                },
                            },
                        },
                        '@media (max-width: 700px)': {
                            width: '100%',
                            marginLeft: '0',
                        },
                    },
                },
                '&.prev-full': {
                    width: '100%',
                    $nest: {
                        'i-icon': {
                            float: 'left',
                        },
                        'i-panel.pager-content': {
                            float: 'right',
                            $nest: {
                                'i-label': {
                                    textAlign: 'right',
                                },
                            },
                        },
                    },
                },
                '&.next-full': {
                    width: '100%',
                    $nest: {
                        'i-icon': {
                            float: 'right',
                        },
                        'i-panel.pager-content': {
                            float: 'left',
                            $nest: {
                                'i-label': {
                                    textAlign: 'left',
                                },
                            },
                        },
                    },
                },
                'i-icon': {
                    height: '20px',
                    width: '20px'
                },
                '.pager-content': {
                    clear: 'none',
                    maxWidth: '90%',
                    $nest: {
                        'i-label': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        },
                        '.pager-title1 div': {
                            fontSize: '12px',
                            fontWeight: '400',
                            color: '#8899A8',
                        },
                        '.pager-title2': {
                            whiteSpace: 'nowrap',
                            $nest: {
                                div: {
                                    fontSize: '20px',
                                    fontWeight: '500',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'block',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
});
