import React from 'react'
import './ErrorBoundary.css'
import fastLogo from "../img/fastLogo.png"

interface State {
  hasError: boolean
}

interface Props {
  children;
  size?: 'min' | 'max'
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  reload() {
    this.setState({ hasError: false })
    window.location.reload()
  }
  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo })
  }
  render() {
    if (this.state.hasError) {
      const mailLink = `mailto:MOE-Dev-FAST@sfr.com?subject=${encodeURIComponent("Erreur sur l'Application FASTR")}`
      return (
        <div className={this.props.size && this.props.size === 'max' ? "wrapper" : 'wrapper-sm'}>
          <img className="logo bg-primary image" src={fastLogo} alt="SFR" />
          <h2>Oups! Une erreur est survenue!</h2>
          <p>
            Vous pouvez essayer de
            <a className="reload" onClick={() => this.reload()}>
              recharger la page
            </a>.
            Si le problème persiste, <a className="contact" href={mailLink}>contactez-nous</a>.
          </p>

        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary