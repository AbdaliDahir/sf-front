import * as moment from "moment";
import * as React from "react";
import * as _ from "lodash"
import {FormattedMessage} from "react-intl";
import {UncontrolledTooltip} from "reactstrap";
// Components
import {CaseNote} from "../../../../model/CaseNote";
import StringUtils from "../../../../utils/StringUtils";
import {Contact} from "../../../../model/Contact";
import {GroupedCaseNotes} from "../../../../model/case/GroupedCaseNotes";
import classnames from 'classnames';
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import "../../View/ViewCase.scss"
import CustomizedPopover from "../../../Commons/CustomizedPopover"

interface Props {
    notes: CaseNote[],
    contacts: Contact[]
}

interface State {
    truncatedNotes: Map<number, boolean | "">
}

export default class NotesHistory extends React.Component<Props, State> {

    private DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;


    constructor(props: Props) {
        super(props);
        this.state = {
            truncatedNotes: new Map()
        }
    }

    public formatNotesByContact = () => {
        const {contacts} = this.props;
        const contactMap = new Map();
        if (contacts) {
            contacts.forEach(contact => contactMap.set(contact.contactId, contact));
        }

        const allNotes = _.sortBy(this.props.notes, note => note.creationDate);
        const notesGroupedByContact = _.groupBy(allNotes, "contact.contactId");

        const groupedNotes: GroupedCaseNotes[] = [];
        for (const contactId in notesGroupedByContact) {
            if (notesGroupedByContact.hasOwnProperty(contactId)) {
                const notes: CaseNote[] = notesGroupedByContact[contactId];
                // If contact is present, group by contact
                if (contactId !== "undefined") {
                    groupedNotes.push({
                        contact: contactMap.get(contactId),
                        notes
                    })
                } else {
                    notes.forEach(note => {
                        groupedNotes.push({
                            notes: [note]
                        })
                    })
                }
            }
        }

        groupedNotes.sort(function compare(a, b) {
            if (a?.notes[0]?.creationDate && b?.notes[0]?.creationDate) {
                const dateA = new Date(a.notes[0].creationDate).getTime();
                const dateB = new Date(b.notes[0].creationDate).getTime();
                return dateB - dateA;
            }
            return 0;
        });
        return groupedNotes;
    };

    public renderContactMedia = (groupedNote: GroupedCaseNotes) => {
        if (groupedNote.contact && groupedNote.contact?.media) {
            if (groupedNote.contact?.media.type !== 'BOUTIQUE') {
                return (
                    <React.Fragment>
                        {/*Media type*/}
                        {groupedNote.contact ?
                            <span><FormattedMessage
                                id={"contact.media." + groupedNote.contact.media.type}/> </span> : ""}

                        {/*Media sens*/}
                        {groupedNote.contact && groupedNote.contact.media.type !== "SANS_CONTACT" ?
                            <span><FormattedMessage
                                id={"cases.create.mediaInOrOut." + groupedNote.contact.media.direction}/></span> : ""}

                        {/*Media channel*/}
                        {groupedNote.contact ?
                            <span> via <FormattedMessage
                                id={"cases.create.channel." + groupedNote.contact.channel}/></span> : "-"}
                    </React.Fragment>
                )
            } else {
                return <td><span><FormattedMessage
                    id={"cases.create.channel." + groupedNote.contact?.media?.type}/></span></td>
            }
        }

        return <td/>
    };

    public renderNotes(): JSX.Element[] {
        let indice = 0;
        const groupedNotes = this.formatNotesByContact();
        return groupedNotes.map((groupedNote, index) => {
                const firstNoteOfGroup = groupedNote.notes[0];
                return (
                    <li key={index} className="text-wrap">
                        <span
                            className={classnames('v-timeline-icon', 'v-not', {'v-last': index === (groupedNotes.length - 1)}, {'v-first': index === 0})}/>
                        <Row className={"mx-1"}>
                            <Col sm={2}>
                                {moment(firstNoteOfGroup.creationDate).format(this.DATETIME_FORMAT)}
                            </Col>
                            <Col sm={2} id={"creator-" + index}>
                                {firstNoteOfGroup.creator ? firstNoteOfGroup.creator.login : ""}
                                <UncontrolledTooltip target={"creator-" + index} placement={"right"}>
                                    <div className={"text-left text-justify"}>
                                        <label><FormattedMessage id="cases.get.creator.location"/>:
                                            <span
                                                className={"ml-2"}>{firstNoteOfGroup.creator && firstNoteOfGroup.creator.site ? firstNoteOfGroup.creator.site.label : "-"}</span>
                                        </label>
                                    </div>
                                    <div className={"text-left text-justify"}>
                                        <label><FormattedMessage id="cases.get.creator.physicallocation"/>:
                                            <span
                                                className={"ml-2"}>{firstNoteOfGroup.creator && firstNoteOfGroup.creator.physicalSite ? firstNoteOfGroup.creator.physicalSite.label : "-"}</span>
                                        </label>
                                    </div>
                                    <div className={"text-left text-justify"}>
                                        <label><FormattedMessage id="cases.get.creator.activity"/>:
                                            <span
                                                className={"ml-2"}>{firstNoteOfGroup.creator && firstNoteOfGroup.creator.activity ? firstNoteOfGroup.creator.activity.label : "-"}</span>
                                        </label>
                                    </div>
                                </UncontrolledTooltip>
                            </Col>
                            <Col sm={2}>
                                {this.renderContactMedia(groupedNote)}
                            </Col>
                            <Col sm={6} className="notes-description-container">
                                {groupedNote.notes.map((note) => <div
                                    className={`description px-2`}
                                    key={note.creationDate}>{this.renderDescription(note, indice)}</div>)}
                            </Col>
                        </Row>
                    </li>
                )
            }
        )
    }

    public renderDescription = (note: CaseNote, noteIndex: number): JSX.Element => {
        return (<span>{this.truncateNote(note, noteIndex)}{this.displayEllipsisIfNecessary(note, noteIndex)}</span>);
    };

    public displayEllipsisIfNecessary = (note: CaseNote, noteIndex: number): JSX.Element => {
        return this.state.truncatedNotes.get(noteIndex) ?
            (<React.Fragment>
                <span className=" ml-2">...</span>
                <CustomizedPopover text={note.description} />
            </React.Fragment>) : <span/>;
    };

    public render(): JSX.Element {
        return (
            <div className="timeline-container">
                <ul className="vertical-timeline w-100 mb-0">
                    {this.renderNotes()}
                </ul>
            </div>
        );
    }

    public truncateNote(note: CaseNote, index: number): string {
        if (!note?.description) {
            return "";
        }
        const truncatedNote = StringUtils.truncate(note.description, 500);
        if (truncatedNote.length !== note.description.length) {
            this.state.truncatedNotes.set(index, true);
        } else {
            this.state.truncatedNotes.set(index, false);
        }
        return truncatedNote;
    }

}
