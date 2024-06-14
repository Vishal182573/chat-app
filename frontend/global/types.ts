export interface User{
    userId: string,
    username:string,
    email: string,
    contactnumber: string,
    password: string,
    photographUri:string,
    status:string,
    contacts: Array<string>,
};

export interface SidebarProps {
    userIds: Array<string>;
    onUserClick: (user: User) => void; // Add this prop to handle user click
}


export interface Chats{
    userId:string,
    userId2:string,
    message:string,
    seen:boolean,
}