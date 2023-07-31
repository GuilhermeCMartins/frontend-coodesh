export type WithAuthenticationType = (
  Component: React.ComponentType<any>
) => React.ComponentType<any>;

export type User = {
  name: string;
  type: string;
  token: string
}