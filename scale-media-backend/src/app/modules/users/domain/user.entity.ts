// this domain just represents a user entity in the system
// this is the core model of user. No framework dependencies here.
export class User {
  constructor(public id: number, public name: string, public email: string) {}
}
