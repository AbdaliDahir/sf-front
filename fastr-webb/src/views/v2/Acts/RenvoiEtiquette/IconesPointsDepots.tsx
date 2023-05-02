import {loadModules} from 'esri-loader';
import {useEffect} from "react";

interface Props {
    pointsDepots
    view?
    selected?
}

const IconesPointsDepots = (props: Props) => {

    useEffect(() => {

        if (props?.pointsDepots) {
            loadModules([
                'esri/Graphic',
                'esri/geometry/Multipoint',
                'esri/PopupTemplate',
                'esri/popup/content/CustomContent']).then(([Graphic, Multipoint, PopupTemplate, CustomContent]) => {

                const mp = new Multipoint();
                const selected = props.selected
                let count = 1;

                props?.pointsDepots?.pointRelais?.forEach(point => {
                    props.view.graphics.add(createGraphicPoint(point, mp, selected, Graphic, PopupTemplate, CustomContent, count++));
                })

                props?.pointsDepots?.espaceSFRs?.forEach(point => {
                    props.view.graphics.add(createGraphicPoint(point, mp, selected, Graphic, PopupTemplate, CustomContent, count++));
                })

                props.view.extent = mp.extent.expand(1.1);
                props.view.popup = {
                    defaultPopupTemplateEnabled: false,
                    dockOptions: {
                        buttonEnabled: false,
                        breakpoint: false
                    }
                }

                props.view.when(zoomingOnlyWithCtrlKey);

            }).catch((err) => console.error(err));
        }

        return function cleanup() {
            props.view.graphics.removeAll();
        };
    }, [props?.pointsDepots, props?.selected]);

    /**
     * Disables classic zoom gestures to enable it only with ctrl key pressed.
     *
     * @param {esri/views/MapView} view - The MapView instance on which to
     *                                  disable zooming gestures.
     */
    const zoomingOnlyWithCtrlKey = (view) => {
        let mouseWheelEvt;

        view.popup.dockEnabled = true;

        // Removes the zoom action on the popup
        view.popup.actions = [];

        // stops propagation of default behavior when an event fires
        function stopEvtPropagation(event) {
            event.stopPropagation();
        }

        // exlude the zoom widget from the default UI
        view.ui.components = ["attribution"];

        // disable mouse wheel scroll zooming on the view
        mouseWheelEvt = view.on("mouse-wheel", stopEvtPropagation);

        // prevents zooming with the + and - keys
        view.on("key-down", (event) => {
            const prohibitedKeys = ["+", "-", "Shift", "_", "="];
            const keyPressed = event.key;
            if (prohibitedKeys.indexOf(keyPressed) !== -1) {
                event.stopPropagation();
            }
            if (event.key === 'Control') {
                if (mouseWheelEvt) {
                    mouseWheelEvt.remove();
                    mouseWheelEvt = null;
                }
            } else {
                if (!mouseWheelEvt) {
                    mouseWheelEvt = view.on("mouse-wheel", stopEvtPropagation);
                }
            }
        });

        view.on("key-up", (event) => {
            if (!mouseWheelEvt) {
                mouseWheelEvt = view.on("mouse-wheel", stopEvtPropagation);
            }
        });

        return view;
    }

    const createGraphicPoint = (point, mp, selected, Graphic, PopupTemplate, CustomContent, count: number) => {

        const longitude = point.geoY.replace(",", ".");
        const latitude = point.geoX.replace(",", ".");

        const p = {
            type: "point",
            longitude,
            latitude
        }

        mp.addPoint([longitude, latitude]);

        const simpleMarkerSymbol = {
            type: "simple-marker",
            color: (selected === point ? [38, 194, 129] : [226, 119, 40]),  // Orange
            outline: {
                color: [255, 255, 255], // White
                width: 1
            }
        };

        const contentPromise = new CustomContent({
            outFields: ["*"],
            creator: (event) => {
                return `
                    <div className={"adr flex-2 d-flex flex-column"}>
                        ${point.adr1 && "<span>" + point.adr1 + "</span><br/>"}
                        ${point.adr2 && "<span>" + point.adr2 + "</span><br/>"}
                        ${point.adr3 && "<span>" + point.adr3 + "</span><br/>"}
                        ${point.adr4 && "<span>" + point.adr4 + "</span><br/>"}
                        <span>${point.codePostale} ${point.ville}</span>
                    </div>
                `;
            }
        });

        const template = new PopupTemplate({
            title: `${count} - ${point.libPdp ? point.libPdp : point.libSFR} - ${point.distance >= 1 ? (point.distance + "km") : ((point.distance * 1000) + "m")}`,
            content: [contentPromise]
        });

        return new Graphic({
            geometry: p,
            symbol: simpleMarkerSymbol,
            popupTemplate: template
        });
    }

    return null;
}

export default IconesPointsDepots;