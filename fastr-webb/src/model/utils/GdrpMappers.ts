import moment from "moment";
import { GdprComment, GdprCommentDto } from "../gdpr";

const dtoToLocalCommentMapper = (comments: GdprCommentDto[]) => {
    let list: GdprComment[] = [];
    comments.forEach(item => {
        item.commentDetails.forEach(details => {
            // index++;
            list = [...list, {
                comment: {
                    creationDate: details.creationDate,
                    id: details.id,
                    type: details.type,
                    updateDate: details.updateDate,
                    status: details.status,
                    value: details.value ?? '',
                },
                objectId: item.objectId,
                objectType: item.objectType,
                qualification: item.qualification,
                index: -1
            }]
        })
    });
    return list;
}
export const dtoToCommentMapper = (comments: GdprCommentDto[]): GdprComment[] => {
    let list: GdprComment[] = [];
    let i = 0;
    list = dtoToLocalCommentMapper(comments).sort((c1, c2) => {
        return moment(c1.comment.creationDate).isAfter(moment(c2.comment.creationDate)) ? -1 : 1;
    }).map(item => {
        i++;
        return { ...item, index: i }
    });
    return list;
}

// export const DisplayToDtoMapper = (comments: GdprComment[]) => {
//     const commentsByObjectId = comments.reduce((groups, item) => ({
//         ...groups,
//         [item.objectId]: [...(groups[item.objectId] || []), item]
//     }), {});
//     const list: GdprCommentDto[] = Object.keys(commentsByObjectId).map(key => {
//         const x = commentsByObjectId[key];
//         let comments: GdprCommentDetails[] = [];
//         x.forEach(item => {
//             comments = [...comments, item.comment]
//         });
//         return {
//             objectId: x[0].objectId,
//             objectType: x[0].objectType,
//             qualification: x[0].qualification,
//             commentDetails: comments
//         }
//     });
// }

export const mappLocalCommentToDTO = (comment: GdprComment): GdprCommentDto => {
    return {
        objectId: comment.objectId,
        objectType: comment.objectType,
        qualification: comment.qualification,
        commentDetails: [comment.comment]
    }
}