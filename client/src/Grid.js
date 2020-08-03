import {Text, Container } from '@inlet/react-pixi';
import Rectangle from './Rectangle';
import React from 'react';

class Grid extends React.Component {
    render() {
        const rectColor = 0x2A2438;
        return (
            <Container>
                <Container>
                    <Rectangle x={0} y={this.props.height/3} width={this.props.width} height={10} fill={rectColor} />
                    <Rectangle x={0} y={this.props.height/3 * 2} width={this.props.width} height={10} fill={rectColor}/>
                    <Rectangle x={this.props.width/3} y={0} width={10} height={this.props.height} fill={rectColor}/>
                    <Rectangle x={this.props.width/3 * 2} y={0} width={10} height={this.props.height} fill={rectColor}/>
                </Container>
            </Container>
        )
    }
}

export default Grid;