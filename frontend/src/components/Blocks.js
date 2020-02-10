import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Block from './Block';

class Blocks extends Component {
    state = { blocks: [], page: 1, chainLength: 0 };
    componentDidMount() {
        fetch(`${document.location.origin}/api/getLength`)
        .then(response => response.json())
        .then(json => this.setState({ chainLength: json}));

        this.fetchBlocks(this.state.page)();
    }
    // returns a callback function to prevent infinitive loop
    fetchBlocks = page => () => {
        fetch(`${document.location.origin}/api/getBlocks/${page}`)
            .then(response => response.json())
            .then(json => this.setState({ blocks: json}));
    }

    render() {        
        return(
            <div>
                <div>
                    <Button  bsStyle="primary" href="/" bsSize="large">Back</Button>
                </div>
                <div>
                    {
                        // math.ceil to round value and make the rounded values to the key of the array to avoid undefined values
                        // with [] add all keys dynamiclly to the array 
                        [...Array(Math.ceil(this.state.chainLength/5)).keys()].map(key => {

                            const page= key+1

                            return( 
                                <span key={key} onClick={this.fetchBlocks(page)}>
                                    <Button bsSize="small" bsStyle="primary">{page}</Button>{'  '}
                                </span>
                            )
                        })
                    }
                </div>
                {
                    this.state.blocks.map(block => {
                        return (
                            <Block key={block.hash} block={block} />
                        );
                    })
                }
            </div>
        );
    }
}

export default Blocks;