import moment from 'moment';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Icon from 'src/components/Bootstrap/Icon';
import { translate } from 'src/components/Intl/IntlGlobalProvider';
import { GdprComment } from 'src/model';
interface GdprTableComponentProps {
    gdprComments: GdprComment[];
    selectCommentToEdit: (index: number) => void;
    selectedComment?: GdprComment;
    updatedCommentCounter: number;
}
interface Resums {
    name: string;
    value: number;
}
const GdprTableComponent = (props: GdprTableComponentProps) => {

    const PAGINATION_OPTIONS = {
        sizePerPageList: [{
            text: '20', value: 10
        }],
        firstPageText: translate.formatMessage({ id: "tray.table.pagination.firstPageText" }),
        prePageText: translate.formatMessage({ id: "tray.table.pagination.prePageText" }),
        nextPageText: translate.formatMessage({ id: "tray.table.pagination.nextPageText" }),
        lastPageText: translate.formatMessage({ id: "tray.table.pagination.lastPageText" }),
        hidePageListOnlyOnePage: true,
        page: 1
    }

    const [resums, setResums] = useState<Resums[]>([]);
    const tableRef: any = useRef();


    useEffect(() => {
        setResums(getCurrentResums());
    }, [props.gdprComments, props.updatedCommentCounter]);

    useEffect(() => {
        if (tableRef.current && props.selectedComment) {
            const lastElement = (tableRef.current.paginationContext.currPage * 10);
            const firstElment = lastElement - 10;
            if (props.selectedComment.index <= firstElment) {
                tableRef.current.paginationContext.currPage = (tableRef.current.paginationContext.currPage - 1);
            }
            if (props.selectedComment.index > lastElement) {
                tableRef.current.paginationContext.currPage = (tableRef.current.paginationContext.currPage + 1);
            }
        }
    }, [props.selectedComment])

    const displayIcon = (status?: string) => {
        switch (status) {
            case 'UPDATED':
                return (
                    <span data-toggle="tooltip" data-placement="top" title={'Modifié'}>
                        <Icon name="icon-contract" color="black" />
                    </span>
                )
            case 'WATCHED':
                return (
                    <span data-toggle="tooltip" data-placement="top" title={'Vérifié'}>
                        <Icon name="icon-eye" color="black" />
                    </span>
                )
            default:
                return (<Fragment />)
        }
    }
    const commentFormatter = cell => {
        const value = cell?.length > 100 ? `${cell.slice(0, 100)}...` : `${cell}`;
        return (<span data-toggle="tooltip" data-placement="top" title={cell}>
            {value}
        </span>)
    };

    const dateFormatter = cell => {
        return (<span>{moment(cell).format(process.env.REACT_APP_FASTR_DATETIME_FORMAT)}</span>)
    }
    const columns = [
        {
            dataField: 'comment.status', text: '', formatter: displayIcon,
            headerStyle: {
                width: '5%',
                border: 'none'
            }
        },
        {
            dataField: 'comment.creationDate', text: 'Date du création', formatter: dateFormatter,
            headerStyle: {
                border: 'none',

            }
        },
        {
            dataField: 'comment.type', text: 'Type', headerStyle: {
                width: '10%',
                textAlign: 'left'
            }
        },
        { dataField: 'comment.updateDate', text: 'Date du modification', formatter: dateFormatter },
        {
            dataField: 'comment.value', text: 'Commentaire/Note', formatter: commentFormatter,
            headerStyle: {
                width: '50%'
            },
            align:'left'
        },
    ];

    const rowEvents = {
        onDoubleClick: (e, row: GdprComment) => {
            props.selectCommentToEdit(row.index);
        }
    };
    const rowStyle = (row, rowIndex) => {
        const selectedIndex = props.selectedComment?.index;
        if (selectedIndex && row.index === selectedIndex) {
            return { 'text-decoration': 'underline' };
        } else {
            return { 'text-decoration': 'none' }
        }
    };

    const getCurrentResums = () => {
        const totals = [
            { name: 'Total', value: props.gdprComments.length },
            { name: 'vérifiés', value: props.gdprComments.filter(a => a.comment.status === 'UPDATED' || a.comment.status === 'WATCHED').length },
            { name: 'modifiés', value: props.updatedCommentCounter }
        ];
        return totals;
    }
    return (
        <div>
            <BootstrapTable
                keyField="id"
                data={props.gdprComments}
                columns={columns}
                pagination={paginationFactory(PAGINATION_OPTIONS)}
                rowEvents={rowEvents}
                rowStyle={rowStyle}
                ref={tableRef}
                noDataIndication={<span className="font-italic">Aucun commentaire</span>}
            />
            {/* resums */}
            <div className='w-100 d-flex justify-content-end pr-5'>
                {resums.map(resum => (
                    <div className='d-flex justify-content-between mr-3'>
                        <span className='font-weight-bold text-capitalize mr-2'>{resum.name}:</span> {resum.value}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GdprTableComponent