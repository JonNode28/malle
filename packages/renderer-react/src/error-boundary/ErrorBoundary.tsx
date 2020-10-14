import React, {ComponentType} from "react";
import s from './ErrorBoundary.pcss';
import { ErrorRendererProps } from "@graphter/core";

interface Props {
  children: any,
  errorRenderer: ComponentType<ErrorRendererProps>
}

interface State {
  err: Error | null,
  errInfo: any | null
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      err: null,
      errInfo: null
    };
  }
  static getDerivedStateFromError(err: Error){
    return { err };
  }
  componentDidCatch(err: Error, errInfo: any){
    this.setState({
      err,
      errInfo
    })
  }
  render(){
    const Error = this.props.errorRenderer
    if(this.state.err !== null){
      return <Error err={this.state.err} />
    }

    return this.props.children || null;
  }
}