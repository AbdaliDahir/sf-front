import React from "react";
import 'react-block-ui/style.css';
import 'react-notifications/lib/notifications.css';
import SectionsComponents, {Placement} from "./SectionsComponentsMapping";
import GenericCardToggleV2 from "./GenericCardToggleV2";

const renderSectionContent = (section, sectionMapping) => {
    return React.createElement(sectionMapping.component, {
        ...section.props,
        icon: sectionMapping.icon,
        casePicto: sectionMapping.casePicto,
        isEditable: section.editable,
        isExpanded: section.expanded,
        isExpandable: section.expandable,
    });
}

const CaseSectionV2 = (section, placementFilter?: Placement) => {
    const sectionMapping = SectionsComponents[section.code]
    if (sectionMapping && (placementFilter === undefined || placementFilter === sectionMapping.placement)) {
        if (sectionMapping.excludeHeader) {
            return (
                renderSectionContent(section, sectionMapping)
            )
        } else {
            return (
                <GenericCardToggleV2 title={sectionMapping.title} icon={sectionMapping.icon}
                                     isExpandable={section.expandable} isExpanded={section.expanded}
                                     cardBodyClass={placementFilter === Placement.SECONDARY ? "p-1" : ""}>
                    {
                        renderSectionContent(section, sectionMapping)
                    }
                </GenericCardToggleV2>
            )
        }
    }
    return <React.Fragment/>;
};

export default CaseSectionV2
