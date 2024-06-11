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
    users: User[];
    onUserClick: (user: User) => void; // Add this prop to handle user click
}

export interface Chats{
    chat:Array<string>,
    user:User,
};