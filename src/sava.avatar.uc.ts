// import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
// import { FileStorageAdapter } from "./files.storage.adapter";
//
// export class saveAvatarCommand {
//   constructor(public fileName: string, public file: Buffer) {
//   };
// };
//
// @CommandHandler(saveAvatarCommand)
// export class saveAvatarUseCase implements ICommandHandler<saveAvatarCommand> {
//   constructor(private fileStorageAdapter: FileStorageAdapter) {
//   };
//
//   async execute(command: saveAvatarCommand) {
//
//     //repo.getUserProfile(userId)
//
//     const result = await this.fileStorageAdapter
//       .saveAvatar(command.fileName, command.file);
//
//     //user.updateAvatar(url, id)
//
//     //repo.saveUser(user)
//
//     // admin email
//     // add to processor queue
//     return true;
//   };
// };
//
// export type SaveFileResultType = {
//   url: string;
//   fileId: string;
// }